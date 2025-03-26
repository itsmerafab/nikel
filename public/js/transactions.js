const myModal = new bootstrap.Modal('#transaction-modal')
const deleteModal = new bootstrap.Modal('#delete-transaction-modal')
const editModal = new bootstrap.Modal('#edit-transaction-modal')
const session = localStorage.getItem('session')
let logged = sessionStorage.getItem('logged')
let isAscending = true
let data = {
  transactions: []
}

document.getElementById('button-logout').addEventListener('click', logout)
document.getElementById('button-delete').addEventListener('click', deleteTransaction)
document.getElementById('button-save').addEventListener('click', saveEditedTransaction)
document.getElementById('sort-button').addEventListener('click', sortTransactionsByDate);

// ADD TRANSACTION
document.getElementById('transaction-form').addEventListener('submit', function (e) {
  e.preventDefault()

  const value = parseFloat(document.getElementById('value-input').value)
  const description = document.getElementById('description-input').value
  const date = document.getElementById('date-input').value
  const type = document.querySelector('input[name="type-input"]:checked').value

  data.transactions.unshift({
    value: value,
    type: type,
    description: description,
    date: date
  })

  saveData(data)
  e.target.reset()
  myModal.hide()

  getTransactions()

  alert('Lançamento adicionado com sucesso.')
})

checkLogged()

function checkLogged() {
  if (session) {
    sessionStorage.setItem('logged', session)
    logged = session
  }

  if (!logged) {
    window.location.href = 'index.html'
    return
  }

  const userData = localStorage.getItem(logged)

  if (userData) {
    data = JSON.parse(userData)
  }

  getTransactions()
}

function logout() {
  sessionStorage.removeItem('logged')
  localStorage.removeItem('session')

  window.location.href = 'index.html'
}

function getTransactions() {
  const transactions = data.transactions
  let transactionsHtml = ``

  if (transactions.length) {
    transactions.forEach((item, index) => {
      let type = 'Entrada'

      if (item.type === '2') {
        type = 'Saída'
      }

      transactionsHtml += `
        <tr>
          <th scope="row">${item.date}</th>
          <td>${item.value.toFixed(2)}</td>
          <td>${type}</td>
          <td>${item.description}</td>
          <td class="d-flex">
            <button class="edit" data-bs-toggle="modal" data-bs-target="#edit-transaction-modal" data-transaction-index="${index}">
              <i class="bi bi-pencil-fill"></i>
            </button>

            <button class="trash" data-bs-toggle="modal" data-bs-target="#delete-transaction-modal" data-transaction-index="${index}">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        </tr>
      `
    })
  }

  document.getElementById('transactions-list').innerHTML = transactionsHtml

  const deleteButtons = document.querySelectorAll('.trash')
  deleteButtons.forEach(button => {
    button.addEventListener('click', showDeleteModal)
  })

  const editButtons = document.querySelectorAll('.edit')
  editButtons.forEach(button => {
    button.addEventListener('click', showEditModal);
  })
}

function showDeleteModal() {
  const transactionIndex = parseInt(this.getAttribute('data-transaction-index'), 10)

  if (!isNaN(transactionIndex)) {
    document.getElementById('button-delete').setAttribute('data-transaction-index', transactionIndex)
  }
}

function showEditModal() {
  const transactionIndex = parseInt(this.getAttribute('data-transaction-index'), 10)

  if (!isNaN(transactionIndex)) {
    const transaction = data.transactions[transactionIndex]

    document.getElementById('edit-value-input').value = transaction.value
    document.getElementById('edit-description-input').value = transaction.description
    document.getElementById('edit-date-input').value = transaction.date
    document.querySelector(`input[name="edit-type-input"][value="${transaction.type}"]`).checked = true

    document.getElementById('button-save').setAttribute('data-transaction-index', transactionIndex)
  }
}

function saveData(data) {
  localStorage.setItem(data.login, JSON.stringify(data))
}

function deleteTransaction() {
  const transactionIndex = parseInt(this.getAttribute('data-transaction-index'), 10)

  if (!isNaN(transactionIndex)) {
    data.transactions.splice(transactionIndex, 1)

    saveData(data)
    deleteModal.hide()

    getTransactions()

    alert('Transação excluída com sucesso.')
  }
}

function saveEditedTransaction() {
  const transactionIndex = parseInt(this.getAttribute('data-transaction-index'), 10)

  if (!isNaN(transactionIndex)) {
    const value = parseFloat(document.getElementById('edit-value-input').value)
    const description = document.getElementById('edit-description-input').value
    const date = document.getElementById('edit-date-input').value
    const type = document.querySelector('input[name="edit-type-input"]:checked').value

    data.transactions[transactionIndex] = {
      value: value,
      type: type,
      description: description,
      date: date
    }

    saveData(data)
    editModal.hide()

    getTransactions()

    alert('Transação editada com sucesso.')
  }
}

function sortTransactionsByDate() {
  if (isAscending) {
    data.transactions.sort((a, b) => new Date(a.date) - new Date(b.date))
  } else {
    data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  isAscending = !isAscending
  saveData(data)

  getTransactions()
}