let usuarios = [];
let registros = [];
let usuarioAtivo = null;

let CHEFE = {
  username: 'chefe',
  password: '1234'
};

function formatarNome(nome) {
  return nome
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

function esconderTodasAsTelas() {
  document.querySelectorAll('.container > div').forEach(div => {
    div.style.display = 'none';
  });
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const usuario = usuarios.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

  if (usuario) {
    usuarioAtivo = usuario;
    mostrarRegistro();
  } else if (username === CHEFE.username && password === CHEFE.password) {
    usuarioAtivo = CHEFE;
    mostrarRegistro();
  } else {
    document.getElementById('login-message').innerText = 'Credenciais inválidas';
  }
}

function mostrarCadastro() {
  esconderTodasAsTelas();
  document.getElementById('cadastro-container').style.display = 'block';
}

function voltarLogin() {
  esconderTodasAsTelas();
  document.getElementById('login-container').style.display = 'block';
}

function cadastrar() {
  let username = document.getElementById('novo-username').value;
  let password = document.getElementById('novo-password').value;

  username = formatarNome(username);

  if (usuarios.length < 10) {
    usuarios.push({ username, password });
    alert('Usuário cadastrado com sucesso!');
    voltarLogin();
  } else {
    document.getElementById('cadastro-message').innerText = 'Limite de usuários atingido';
  }
}

function mostrarRegistro() {
  esconderTodasAsTelas();
  document.getElementById('registro-container').style.display = 'block';
  document.getElementById('nome').value = formatarNome(usuarioAtivo.username);

  if (usuarioAtivo === CHEFE) {
    document.getElementById('chefe-button').style.display = 'block';
    document.getElementById('filtro-container').style.display = 'block';
    preencherSelectUsuariosExportacao();
  } else {
    document.getElementById('chefe-button').style.display = 'none';
    document.getElementById('filtro-container').style.display = 'none';
  }

  atualizarRegistros();
}

function registrar(tipo) {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  registros.push({ nome: formatarNome(usuarioAtivo.username), tipo, data, hora });
  atualizarRegistros();
  mostrarPopup();
}

function atualizarRegistros(filtroNome = null) {
  const registrosDiv = document.getElementById('registros');
  registrosDiv.innerHTML = '<h3>Histórico de Registros:</h3>';

  const tiposBonitos = {
    entrada: 'Entrada',
    saida: 'Saída',
    inicio_almoco: 'Início almoço',
    fim_almoco: 'Fim almoço'
  };

  let registrosFiltrados = registros;

  if (filtroNome) {
    registrosFiltrados = registros.filter(r => r.nome.toLowerCase().includes(filtroNome.toLowerCase()));
  }

  registrosFiltrados.forEach(registro => {
    const div = document.createElement('div');
    div.classList.add('registro');
    const tipoFormatado = tiposBonitos[registro.tipo] || registro.tipo;
    div.innerHTML = `${registro.nome} - ${tipoFormatado} - ${registro.data} - ${registro.hora}`;
    registrosDiv.appendChild(div);
  });
}

function filtrarRegistros() {
  const termo = document.getElementById('filtro-nome').value;
  atualizarRegistros(termo);
}

function mostrarPopup() {
  document.getElementById('popup').style.display = 'block';
}

function fecharPopup() {
  document.getElementById('popup').style.display = 'none';
}

function mostrarConfiguracoes() {
  esconderTodasAsTelas();
  document.getElementById('configuracoes-container').style.display = 'block';
}

function voltarRegistro() {
  esconderTodasAsTelas();
  document.getElementById('registro-container').style.display = 'block';
}

function salvarConfiguracoes() {
  let novoUsername = document.getElementById('novo-username-config').value;
  const novoPassword = document.getElementById('novo-password-config').value;

  novoUsername = formatarNome(novoUsername);

  if (usuarioAtivo === CHEFE) {
    CHEFE.username = novoUsername;
    CHEFE.password = novoPassword;
  } else {
    usuarioAtivo.username = novoUsername;
    usuarioAtivo.password = novoPassword;
  }

  alert('Configurações salvas!');
  voltarRegistro();
}

function gerenciarUsuarios() {
  esconderTodasAsTelas();
  document.getElementById('gerenciar-usuarios').style.display = 'block';
  atualizarListaUsuarios();
}

function voltarConfiguracoes() {
  esconderTodasAsTelas();
  document.getElementById('configuracoes-container').style.display = 'block';
}

function atualizarListaUsuarios() {
  const lista = document.getElementById('usuarios-lista');
  lista.innerHTML = '';

  usuarios.forEach((usuario, index) => {
    const item = document.createElement('li');
    item.innerHTML = `${formatarNome(usuario.username)} <button onclick="excluirUsuario(${index})">Excluir</button>`;
    lista.appendChild(item);
  });
}

function excluirUsuario(index) {
  usuarios.splice(index, 1);
  atualizarListaUsuarios();
}

function mostrarExportacao() {
  esconderTodasAsTelas();
  document.getElementById('exportacao-container').style.display = 'block';
}

function preencherSelectUsuariosExportacao() {
  const select = document.getElementById('usuario-exportacao');
  select.innerHTML = '<option value="todos">Todos</option>';

  usuarios.forEach(usuario => {
    const option = document.createElement('option');
    option.value = usuario.username;
    option.innerText = formatarNome(usuario.username);
    select.appendChild(option);
  });
}

function exportarDados() {
  const usuarioSelecionado = document.getElementById('usuario-exportacao').value;
  let dadosExportados = usuarioSelecionado === 'todos'
    ? registros
    : registros.filter(r => r.nome === usuarioSelecionado);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dadosExportados);
  XLSX.utils.book_append_sheet(wb, ws, "Registros");
  XLSX.writeFile(wb, 'registros_usuarios.xlsx');
}

function logout() {
  usuarioAtivo = null;
  esconderTodasAsTelas();
  document.getElementById('login-container').style.display = 'block';
}
