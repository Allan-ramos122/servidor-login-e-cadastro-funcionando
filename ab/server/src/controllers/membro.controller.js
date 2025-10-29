const pool = require('./db');

// Criar um novo membro
async function createMembro(req, res) {
  const { me_nome, me_cpf, me_email, me_descricao, me_lattes, me_senha, me_administrador, me_cargo } = req.body;
  const me_imagem = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO membros (
        me_nome, me_cpf, me_email, me_descricao, me_lattes, 
        me_senha, me_imagem, me_administrador, me_cargo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        me_nome,
        me_cpf,
        me_email,
        me_descricao,
        me_lattes,
        me_senha,
        me_imagem,
        me_administrador || false,
        me_cargo || null
      ]
    );

    res.status(201).json({
      message: 'Membro criado com sucesso!',
      membro: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar membro:', error);
    res.status(500).json({ error: 'Erro ao criar membro' });
  }
}

// Obter todos os membros
async function getAllMembros(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        m.*, 
        c.ca_nome_cargo AS nome_cargo
      FROM membros m
      LEFT JOIN cargo c ON m.me_cargo = c.id_cargo
      ORDER BY m.id_membro DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    res.status(500).json({ error: 'Erro ao buscar membros' });
  }
}

// Obter um membro específico por ID
async function getMembroById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         m.*, 
         c.ca_nome_cargo AS nome_cargo
       FROM membros m
       LEFT JOIN cargo c ON m.me_cargo = c.id_cargo
       WHERE m.id_membro = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar membro:', error);
    res.status(500).json({ error: 'Erro ao buscar membro' });
  }
}

// Atualizar um membro existente
async function updateMembro(req, res) {
  const { id } = req.params;
  const { me_nome, me_cpf, me_email, me_descricao, me_lattes, me_senha, me_administrador, me_cargo } = req.body;
  const me_imagem = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `UPDATE membros
       SET 
         me_nome = $1,
         me_cpf = $2,
         me_email = $3,
         me_descricao = $4,
         me_lattes = $5,
         me_senha = $6,
         me_imagem = COALESCE($7, me_imagem),
         me_administrador = $8,
         me_cargo = $9
       WHERE id_membro = $10
       RETURNING *`,
      [
        me_nome,
        me_cpf,
        me_email,
        me_descricao,
        me_lattes,
        me_senha,
        me_imagem,
        me_administrador,
        me_cargo,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Membro não encontrado para atualização' });
    }

    res.status(200).json({
      message: 'Membro atualizado com sucesso!',
      membro: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    res.status(500).json({ error: 'Erro ao atualizar membro' });
  }
}

// Deletar um membro
async function deleteMembro(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM membros WHERE id_membro = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Membro não encontrado para exclusão' });
    }

    res.status(200).json({ message: 'Membro deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar membro:', error);
    res.status(500).json({ error: 'Erro ao deletar membro' });
  }
}

module.exports = {
  createMembro,
  getAllMembros,
  getMembroById,
  updateMembro,
  deleteMembro
};
