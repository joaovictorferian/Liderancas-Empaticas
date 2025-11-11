import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

function Chat({ isOpen, onClose }) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [userId, setUserId] = useState(null);

  // 🔹 Buscar ID do aluno do localStorage
  useEffect(() => {
    const aluno = JSON.parse(localStorage.getItem("ID_Aluno"));
    if (aluno && aluno.ID_Aluno) {
      setUserId(aluno.ID_Aluno);
    }
  }, []);

  // 🔹 Conectar socket e carregar contatos
  useEffect(() => {
    if (!isOpen || !userId) return;

    const newSocket = io("http://localhost:500");
    setSocket(newSocket);

    // Buscar todos os usuários exceto o logado
    axios
      .get(`http://localhost:500/api/users`)
      .then((res) => {
        setContacts(res.data.filter((u) => u.ID_Aluno !== userId));
      })
      .catch((err) => console.error("Erro ao buscar contatos:", err));

    // Receber mensagens em tempo real
    newSocket.on("receivedMessage", (msg) => {
      if (
        (msg.idRemetente === userId &&
          msg.idDestinatario === selectedContact?.ID_Aluno) ||
        (msg.idDestinatario === userId &&
          msg.idRemetente === selectedContact?.ID_Aluno)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => newSocket.disconnect();
  }, [isOpen, userId, selectedContact]);

  // 🔹 Carregar mensagens ao selecionar contato
  useEffect(() => {
    if (!selectedContact || !userId) return;

    axios
      .get(
        `http://localhost:500/api/users/conversa/${userId}/${selectedContact.ID_Aluno}`
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Erro ao carregar mensagens:", err));
  }, [selectedContact, userId]);

  // 🔹 Enviar mensagem
  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() || !selectedContact) return;

    const msgObj = {
      idRemetente: userId,
      idDestinatario: selectedContact.ID_Aluno,
      mensagem: message,
    };

    try {
      await axios.post("http://localhost:500/api/users/messages", msgObj);
      setMessage("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  }

  // 🔹 Clique direito (editar/apagar)
  function handleRightClick(e, msg) {
    e.preventDefault();
    const action = window.prompt(
      "Digite 'editar' para editar ou 'apagar' para excluir:"
    );

    if (action === "editar") {
      setEditingMessage(msg);
      setEditText(msg.mensagem);
    } else if (action === "apagar") {
      axios
        .delete(
          `http://localhost:500/api/users/messages/${msg.idMensagem}`
        )
        .then(() =>
          setMessages((prev) =>
            prev.filter((m) => m.idMensagem !== msg.idMensagem)
          )
        )
        .catch((err) => console.error("Erro ao apagar mensagem:", err));
    }
  }

  // 🔹 Confirmar edição
  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:500/api/users/messages/${editingMessage.idMensagem}`,
        { mensagem: editText }
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.idMensagem === editingMessage.idMensagem
            ? { ...m, mensagem: editText }
            : m
        )
      );
      setEditingMessage(null);
      setEditText("");
    } catch (err) {
      console.error("Erro ao editar mensagem:", err);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          <h3>Chat</h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="chat-container">
          {/* 🔹 Contatos */}
          <div className="contacts">
            {contacts.map((contact) => (
              <div
                key={contact.ID_Aluno}
                className={`contact ${
                  selectedContact?.ID_Aluno === contact.ID_Aluno
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="avatar" />
                <div className="contact-info">
                  <div className="name">{contact.Aluno_Nome}</div>
                  <div className="preview">Clique para conversar</div>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Conversa */}
          <div className="conversation">
            {selectedContact ? (
              <>
                <div className="messages">
                  {messages.map((msg) => (
                    <div
                      key={msg.idMensagem}
                      className={`message ${
                        msg.idRemetente === userId ? "sent" : "received"
                      }`}
                      onContextMenu={(e) => handleRightClick(e, msg)}
                    >
                      <p>{msg.mensagem}</p>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                <form className="message-input" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mensagem..."
                  />
                  <button type="submit" className="send-btn">
                    ➤
                  </button>
                </form>
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                Selecione um contato para iniciar uma conversa
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Modal de edição */}
        {editingMessage && (
          <div className="edit-modal">
            <div className="edit-box">
              <h4>Editar mensagem</h4>
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="edit-actions">
                  <button type="submit">Salvar</button>
                  <button
                    type="button"
                    onClick={() => setEditingMessage(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
