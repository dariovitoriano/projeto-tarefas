const express = require('express');
const path = require('path');
const tarefas = require('./tarefas');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/tarefas', (req, res) => res.json(tarefas.listar()));

app.post('/api/tarefas', (req, res) => {
  try {
    res.status(201).json(tarefas.adicionar(req.body.titulo));
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

app.patch('/api/tarefas/:id/concluir', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }
  try {
    res.json(tarefas.concluir(id));
  } catch (e) {
    res.status(404).json({ erro: e.message });
  }
});

app.delete('/api/tarefas/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }
  try {
    tarefas.remover(id);
    res.status(204).end();
  } catch (e) {
    res.status(404).json({ erro: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
