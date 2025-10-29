const pool = require('./db'); // Importa a conexão com o banco

// Criar uma nova vaga (CREATE)
async function createVaga(req, res) {
  // Pega os campos do corpo da requisição
  // Note a "tradução" de co_nome para co_titulo e co_descricao para co_lide
  const { co_nome, co_descricao, co_data, co_objetivo, co_requisitos, co_plano_trabalho, co_atividades } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO conteudo (
         co_titulo, co_lide, co_data, co_objetivo, co_requisitos, 
         co_plano_trabalho, co_atividades
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        co_nome,             // $1 -> co_titulo
        co_descricao,        // $2 -> co_lide
        co_data || null,     // $3 -> co_data (usa null se não for fornecido)
        co_objetivo,         // $4
        co_requisitos,       // $5
        co_plano_trabalho,   // $6
        co_atividades        // $7
      ]
    );

    res.status(201).json({
      message: 'Vaga criada com sucesso!',
      vaga: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    res.status(500).json({ error: 'Erro ao criar vaga' });
  }
}

// Obter todas as vagas (READ ALL)
async function getAllVagas(req, res) {
  try {
    // Seleciona apenas os campos relevantes e renomeia para o front-end
    const result = await pool.query(`
      SELECT 
        id_conteudo,
        co_titulo AS co_nome,
        co_lide AS co_descricao,
        co_data,
        co_objetivo,
        co_requisitos,
        co_plano_trabalho,
        co_atividades
      FROM conteudo
      ORDER BY id_conteudo DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
}

// Obter uma vaga específica por ID (READ ONE)
async function getVagaById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         id_conteudo,
         co_titulo AS co_nome,
         co_lide AS co_descricao,
         co_data,
         co_objetivo,
         co_requisitos,
         co_plano_trabalho,
         co_atividades
       FROM conteudo
       WHERE id_conteudo = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    res.status(500).json({ error: 'Erro ao buscar vaga' });
  }
}

// Atualizar uma vaga existente (UPDATE)
async function updateVaga(req, res) {
  const { id } = req.params;
  const { co_nome, co_descricao, co_data, co_objetivo, co_requisitos, co_plano_trabalho, co_atividades } = req.body;

  try {
    const result = await pool.query(
      `UPDATE conteudo
       SET 
         co_titulo = $1,
         co_lide = $2,
         co_data = $3,
         co_objetivo = $4,
         co_requisitos = $5,
         co_plano_trabalho = $6,
         co_atividades = $7
       WHERE id_conteudo = $8
       RETURNING *`,
      [
        co_nome,
        co_descricao,
        co_data,
        co_objetivo,
        co_requisitos,
        co_plano_trabalho,
        co_atividades,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vaga não encontrada para atualização' });
    }

    res.status(200).json({
      message: 'Vaga atualizada com sucesso!',
      vaga: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    res.status(500).json({ error: 'Erro ao atualizar vaga' });
  }
}

// Deletar uma vaga (DELETE)
async function deleteVaga(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM conteudo WHERE id_conteudo = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vaga não encontrada para exclusão' });
    }

    res.status(200).json({ message: 'Vaga deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar vaga:', error);
    res.status(500).json({ error: 'Erro ao deletar vaga' });
  }
}

// Exporta todas as funções
module.exports = {
  createVaga,
  getAllVagas,
  getVagaById,
  updateVaga,
  deleteVaga
};