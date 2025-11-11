import { useState } from "react";
import Chat from "./modal/chat.jsx";

function HeaderAdmin() {
  const [showChat, setShowChat] = useState(false); // ✅ corrigido camelCase

  return (
    <header className="headerAdmin">
      <div className="divPesquisar">
        <div className="divEsquerda">
        </div>
      </div>

      {/* 🔹 O chat só aparece se showChat = true */}
      <Chat isOpen={showChat} onClose={() => setShowChat(false)} />
    </header>
  );
}

export default HeaderAdmin;
