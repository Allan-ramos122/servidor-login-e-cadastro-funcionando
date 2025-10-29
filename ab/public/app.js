// URL da API
const API_URL = 'http://localhost:3000/api/membros';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('memberForm');
    const membersTable = document.getElementById('membersTable');

    // Função para listar membros
    async function listarMembros() {
        const res = await fetch(API_URL);
        const membros = await res.json();

        membersTable.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Descrição</th>
                <th>Lattes</th>
                <th>Cargo</th>
                <th>Ações</th>
            </tr>
        `;

        membros.forEach(membro => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${membro.id_membro}</td>
                <td>${membro.me_nome}</td>
                <td>${membro.me_email}</td>
                <td>${membro.me_cpf}</td>
                <td>${membro.me_descricao}</td>
                <td><a href="${membro.me_lattes}" target="_blank">${membro.me_lattes || ''}</a></td>
                <td>${membro.nome_cargo || membro.me_cargo}</td>
                <td>
                    <button onclick="editarMembro(${membro.id_membro})">Editar</button>
                    <button onclick="deletarMembro(${membro.id_membro})">Excluir</button>
                </td>
            `;
            membersTable.appendChild(row);
        });
    }

    // Função para criar ou atualizar membro
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('memberId').value;
        const payload = {
            me_nome: document.getElementById('me_nome').value,
            me_email: document.getElementById('me_email').value,
            me_cpf: document.getElementById('me_cpf').value,
            me_descricao: document.getElementById('me_descricao').value,
            me_lattes: document.getElementById('me_lattes').value,
            me_cargo: parseInt(document.getElementById('me_cargo').value),
            me_senha: document.getElementById('me_senha').value
        };

        try {
            if (id) {
                // Atualizar
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Criar
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            form.reset();
            document.getElementById('memberId').value = '';
            listarMembros();
        } catch (err) {
            console.error('Erro ao salvar membro:', err);
            alert('Erro ao salvar membro.');
        }
    });

    // Função global para editar
    window.editarMembro = async function(id) {
        const res = await fetch(`${API_URL}/${id}`);
        const membro = await res.json();

        document.getElementById('memberId').value = membro.id_membro;
        document.getElementById('me_nome').value = membro.me_nome;
        document.getElementById('me_email').value = membro.me_email;
        document.getElementById('me_cpf').value = membro.me_cpf;
        document.getElementById('me_descricao').value = membro.me_descricao;
        document.getElementById('me_lattes').value = membro.me_lattes;
        document.getElementById('me_cargo').value = membro.me_cargo;
        document.getElementById('me_senha').value = membro.me_senha || '';
    }

    // Função global para deletar
    window.deletarMembro = async function(id) {
        if (!confirm('Tem certeza que deseja deletar este membro?')) return;

        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            listarMembros();
        } catch (err) {
            console.error('Erro ao deletar membro:', err);
            alert('Erro ao deletar membro.');
        }
    }

    // Inicializa a lista de membros
    listarMembros();
});
