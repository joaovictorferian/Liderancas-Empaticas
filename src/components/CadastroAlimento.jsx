import { useState } from "react";
import api from "../api";

function CadastroAlimento({ onSelectPage }) {
  const [formData, setFormData] = useState({
    Alimento_Cod: "",
    Alimento_Nome: "",
    Alimento_Marca: "",
    Alimento_Validade: "",
    Alimento_Peso: "",
    Alimento_Quantidade: "",
    Aluno_Grupo: localStorage.getItem("Aluno_Grupo") || "", // Inicializa com o valor do localStorage, se existir
  });
  const isAlunoGrupoReadOnly = !!localStorage.getItem("Aluno_Grupo"); // Define se o campo será somente leitura
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [eanValido, setEanValido] = useState(false);

  // Valida EAN-13 com cálculo do dígito verificador
  const validarEAN13 = (codigo) => {
    if (!/^\d{13}$/.test(codigo)) return false;
    const digits = codigo.split("").map(Number);
    const checkDigit = digits.pop(); // último

    const soma = digits.reduce((acc, d, idx) => {
      return acc + d * (idx % 2 === 0 ? 1 : 3);
    }, 0);
    const resto = soma % 10;
    const digitoCalculado = resto === 0 ? 0 : 10 - resto;
    return digitoCalculado === checkDigit;
  };

  const handleChange = async (e) => {
    const { name } = e.target;
    let value = e.target.value;

    if (name === "Alimento_Cod") {
      value = value.replace(/\D/g, "");

      if (value.length > 13) value = value.slice(0, 13);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "Alimento_Cod" && value.length === 13) {
      await buscarAlimento(value);
    }
  };

  const buscarAlimento = async (ean) => {
    const clean = String(ean).trim();
    if (!validarEAN13(clean)) {
      alert(
        "❌ Código EAN inválido! Deve ser um EAN-13 válido (dígito verificador incorreto)."
      );
      setEanValido(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/codigoAlimento/${clean}`);
      console.log(res);
      // se 200 e retornar objeto do alimento, preenche
      if (res.data) {
        setFormData((prev) => ({
          ...prev,
          Alimento_Cod: clean,
          Alimento_Nome: res.data.Alimento_Nome,
          Alimento_Marca: res.data.Alimento_Marca,
          Alimento_Peso: res.data.Alimento_Peso,
        }));
        setEanValido(true);
        setShowModal(false);
      }
    } catch (err) {
      // se backend devolver 404 (não existe), abre modal para cadastrar novo alimento
      if (err.response?.status === 404) {
        setShowModal(true);
        // mantemos código preenchido no modal para facilitar cadastro
        setEanValido(false);
      } else {
        alert("Erro ao buscar alimento no banco.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNovoAlimento = async (e) => {
    e.preventDefault();
    const { Alimento_Cod, Alimento_Nome, Alimento_Marca, Alimento_Peso } =
      formData;

    if (!Alimento_Cod || !Alimento_Nome || !Alimento_Marca || !Alimento_Peso) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    // reforço: valida checksum antes de enviar novo alimento
    if (!validarEAN13(Alimento_Cod)) {
      alert("EAN inválido. Verifique o código antes de cadastrar.");
      return;
    }

    try {
      const res = await api.post("/cadastroAlimento", {
        Alimento_Cod,
        Alimento_Nome,
        Alimento_Marca,
        Alimento_Peso,
      });

      alert(res.data.msg || "Alimento cadastrado com sucesso!");
      setShowModal(false);
      setEanValido(true);
      // já preenche também o nome/marca/peso (resposta do back pode retornar o objeto; se quiser, adapte)
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar novo alimento.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.Alimento_Cod ||
      !formData.Alimento_Validade ||
      !formData.Alimento_Quantidade
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!eanValido) {
      alert(
        "EAN inválido ou alimento não validado. Verifique o código primeiro."
      );
      return;
    }

    try {
      setLoading(true);
      const body = {
        Alimento_Nome: formData.Alimento_Nome,
        Alimento_Marca: formData.Alimento_Marca,
        Alimento_Codigo: formData.Alimento_Cod, // nome diferente do campo original
        Alimento_Validade: formData.Alimento_Validade,
        Alimento_Peso: formData.Alimento_Peso,
        Alimento_Quantidade: formData.Alimento_Quantidade,
        Aluno_Grupo: formData.Aluno_Grupo,
      };

      const response = await api.post("/doacoes", body);

      alert(response.data.msg || "Doação registrada com sucesso!");

      setFormData({
        Alimento_Cod: "",
        Alimento_Nome: "",
        Alimento_Marca: "",
        Alimento_Validade: "",
        Alimento_Peso: "",
        Alimento_Quantidade: "",
        Aluno_Grupo: localStorage.getItem("Aluno_Grupo") || "",
      });
      setEanValido(false);

      if (onSelectPage) onSelectPage("alimentos");
    } catch (err) {
      console.error("Erro no envio:", err);
      alert(err.response?.data?.error || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Validação de Doações</h2>

      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código EAN (13 dígitos) *</label>
          <input
            type="text"
            name="Alimento_Cod"
            value={formData.Alimento_Cod}
            onChange={handleChange}
            maxLength={13}
            inputMode="numeric"
            pattern="\d{13}"
            required
          />
        </div>

        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            name="Alimento_Nome"
            value={formData.Alimento_Nome}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Marca</label>
          <input
            type="text"
            name="Alimento_Marca"
            value={formData.Alimento_Marca}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Peso (kg/g)</label>
          <input
            type="text"
            name="Alimento_Peso"
            value={formData.Alimento_Peso}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Validade *</label>
          <input
            type="date"
            name="Alimento_Validade"
            value={formData.Alimento_Validade}
            onChange={handleChange}
            required
            disabled={!eanValido}
          />
        </div>

        <div className="form-group">
          <label>Quantidade *</label>
          <input
            type="number"
            name="Alimento_Quantidade"
            value={formData.Alimento_Quantidade}
            onChange={handleChange}
            required
            min="1"
            disabled={!eanValido}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Aluno_Grupo">Grupo do Aluno</label>
          <input
            type="text"
            id="Aluno_Grupo"
            name="Aluno_Grupo"
            value={formData.Aluno_Grupo}
            readOnly={isAlunoGrupoReadOnly} // Torna o campo somente leitura se houver valor no localStorage
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Aluno_Grupo: e.target.value }))
            }
            placeholder="Digite o grupo do aluno"
            className={`input ${isAlunoGrupoReadOnly ? "input-readonly" : ""}`} // Adiciona uma classe para estilização
          />
        </div>

        <button
          type="submit"
          className="btn-confirmar"
          disabled={!eanValido || loading}
        >
          {loading ? "Enviando..." : "Confirmar Doação"}
        </button>
      </form>

      {/* Modal para cadastro de novo alimento */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("modal-overlay"))
              setShowModal(false);
          }}
        >
          <div className="modal">
            <h3>Novo Alimento</h3>
            <form onSubmit={handleNovoAlimento}>
              <label>Código EAN</label>
              <input
                type="text"
                name="Alimento_Cod"
                value={formData.Alimento_Cod}
                disabled
              />

              <label>Nome *</label>
              <input
                type="text"
                name="Alimento_Nome"
                value={formData.Alimento_Nome}
                onChange={handleChange}
                required
              />

              <label>Marca *</label>
              <input
                type="text"
                name="Alimento_Marca"
                value={formData.Alimento_Marca}
                onChange={handleChange}
                required
              />

              <label>Peso *</label>
              <input
                type="text"
                name="Alimento_Peso"
                value={formData.Alimento_Peso}
                onChange={handleChange}
                required
              />

              <div className="footerModal">
                <button type="submit" className="btn-confirmar">
                  Cadastrar
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroAlimento;
