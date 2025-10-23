const { pool } = require('./bd.js');

async function cadastrarUsuario(req, res) {

    const { mail, nome } = req.body
    if (!mail || mail.length == 0) {
        return res.json({ erro: "Forneça o email" });
    } else if (!nome || nome.length == 0) {
        return res.json({ erro: "Forneça o nome" });
    } else {
        let resposta = await pool.query(
            "SELECT idusuario, email,nome FROM tbusuario WHERE email=$1 LIMIT 1",
            [mail]
        );
    
    if (resposta.rowCount > 0) {
        return res.json(resposta.rows[0]);
    } else {
        resposta = await pool.query(
            "INSERT INTO tbusuario(email,nome) values ($1,$2) RETURNING idusuario, email, nome",
            [mail, nome]
        );
        return res.json(resposta.rows[0]);
    }
}

}

async function login(req, res) {
  const { mail } = req.body;
  if (!mail || mail.length == 0) {
    return res.json({ erro: "Forneça o e-mail." });
  } else {
    // Procura na tbusuario o 1o registro que satisfaz as condições
    let resposta = await pool.query(
      "SELECT idusuario,email,nome FROM tbusuario WHERE email=$1 LIMIT 1",
      [mail]
    );
    // Verifica se o usuário existe na tbusuario
    if (resposta.rowCount > 0) {
      // Retorna o registro no formato JSON
      return res.json(resposta.rows[0]);
    } else {
      return res.json({ erro: "Usuário não cadastrado." });
    }
  }
}

module.exports = { cadastrarUsuario, login};
