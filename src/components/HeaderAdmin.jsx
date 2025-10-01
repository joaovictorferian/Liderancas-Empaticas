function HeaderAdmin() {
  return (
    <header className="headerAdmin">
      <div className="divPesquisar">
        <div className="divEsquerda">
          <input className="inputAdmin" type="text" placeholder="Pesquisar" />
          <button className="btnPesquisa">
            <img className="iconPesquisa" src="search.png" alt="pesquisa" />
          </button>
        </div>
        <div className="divDireita">
          <button className="btnNotif">
            <img className="btnDivDireita" src="notification.png" alt="notif" />
          </button>
          <button className="btnChat">
            <img className="btnDivDireita" src="bubble-chat.png" alt="chat" />
          </button>
          <button className="btnPerfil">
            <img className="btnDivDireita" src="user.png" alt="user" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderAdmin;
