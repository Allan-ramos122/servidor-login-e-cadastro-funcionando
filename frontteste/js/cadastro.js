async function salvarUsuario() {
  // 1. Pegar os elementos da tela

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const msgErro = document.querySelector('.msg-erro');

  // 2. Limpar mensagens de erro
  msgErro.style.display = 'none';
  msgErro.innerHTML = '';

  // 3. Validar campos
  if (!nome || !email) {
    msgErro.innerHTML = 'Todos os campos são obrigatórios.';
    msgErro.style.display = 'block';
    return;
  }

  // 4. Definir a URL do back-end
  const url = 'http://localhost:3030/usuario';

  // 5. Criar o corpo (body) da requisição
  const body = { nome, email };

  // 6. Tentar fazer a requisição (fetch)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // 7. Analisar a resposta
    if (response.status === 201) { // 201 = Criado com sucesso
      alert('Usuário cadastrado com sucesso! Faça o login.');
      window.location.href = 'login.html'; // Redireciona para o login
    } else {
      const erro = await response.json();
      msgErro.innerHTML = erro.erro; // Ex: E-mail já existe
      msgErro.style.display = 'block';
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    msgErro.innerHTML = 'Não foi possível conectar ao servidor.';
    msgErro.style.display = 'block';
  }
}