const STORAGE_KEY = 'orden-rest';
let orden = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

const listaPedido = document.getElementById('pedido');
const totalSpan = document.getElementById('total');
const propinaInput = document.getElementById('propina');
const vaciarBtn = document.getElementById('vaciar');

function idUnico() {
  return Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

// Agregar desde botones
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const nombre = btn.dataset.nombre;
    const precio = Number(btn.dataset.precio);
    const cantidad = Number(btn.closest('.card-body').querySelector('.cantidad').value) || 1;

    orden.push({ id: idUnico(), nombre, precio, cantidad });
    guardarYRender();
  });
});

function guardarYRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orden));
  render();
}

function render() {
  listaPedido.innerHTML = '';
  let subtotal = 0;

  orden.forEach(item => {
    subtotal += item.precio * item.cantidad;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div>
        <strong>${item.nombre}</strong> x${item.cantidad} <small class="text-muted">($${item.precio} c/u)</small>
      </div>
      <div>
        $${(item.precio * item.cantidad).toFixed(2)}
        <button class="btn btn-sm btn-outline-danger ms-2 remove-btn" data-id="${item.id}">Eliminar</button>
      </div>
    `;
    listaPedido.appendChild(li);
  });

  const prop = Number(propinaInput.value) || 0;
  const propina = subtotal * prop / 100;
  totalSpan.textContent = (subtotal + propina).toFixed(2);

  // listeners para eliminar
  document.querySelectorAll('.remove-btn').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.id;
      orden = orden.filter(i => i.id !== id);
      guardarYRender();
    });
  });
}

propinaInput.addEventListener('input', render);
vaciarBtn.addEventListener('click', () => {
  orden = [];
  guardarYRender();
});

// arranca
render();
