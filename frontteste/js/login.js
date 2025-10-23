async function logar () {

const email = document.getElementById('email').value; 
const nome = document.getElementById('nome').value;
 const msgErro = document.querySelector('.msg-erro');

 msgErro.style.display = 'none';
  msgErro.innerHTML = '';

if (!email || !nome) {
    msgErro.innerHTML = 'Por favor, preencha e-mail e senha.';
    msgErro.style.display = 'block';
    return;
}

  const url = 'http://localhost:3030/login';


const body = {
    mail:email,
    nome:nome
};

 try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // 7. Analisar a resposta
    if (response.ok) {
      const usuario = await response.json();
      localStorage.setItem('usuario', JSON.stringify(usuario));
      window.location.href = 'index.html'; // Redireciona
    } else {
      const erro = await response.json();
      msgErro.innerHTML = erro.erro; // Exibe o erro vindo do back-end
      msgErro.style.display = 'block';
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    msgErro.innerHTML = 'Não foi possível conectar ao servidor. Verifique o console (F12).';
    msgErro.style.display = 'block';
  }
}