// Classe que cria o objeto de despesa
class Expense
{
    constructor(year, month, day, type, description, val)
    {
        this.year = year
        this.month = month
        this.day = day
        this.type = type
        this.description = description
        this.val = val
    }

    validateData()
    {
        for(let i in this)
        {
            if(this[i]=== undefined || this[i] === null || this[i] === '')
            {
                return false
            }
            return true
        }
    }
}

// Classe que configura o banco de dados

class Db
{
    constructor()
    {
        let itemId = localStorage.getItem('id')

        // Caso o primeiro ID nao exista criar o primeiro
        if(itemId === null)
        {
            localStorage.setItem('id', 0)
        }
    }

    inputToDB(expense)
    {
        let id = this.getNextItem()
        localStorage.setItem(id, JSON.stringify(expense))

        localStorage.setItem('id', id)
    }

    getNextItem()
    {
        let nexItemId = localStorage.getItem('id')
        return parseInt(nexItemId)+1
    }

    // Carrega todas as despesas
    loadAllExpenses()
    {
        let getId = localStorage.getItem('id')
         // Array com todas as despesas
        let expenses = Array()

        for(let i = 1; i <= getId; i++)
        {
            let expense = JSON.parse(localStorage.getItem(i))

            // Caso o JSON a ser lido esteja vazio ou tenha violado a ordem
            // Ele automaticante pulará a ordem mantendo a integridade
            if(expense === null)
            {
                continue
            }

            expense.id = i

            expenses.push(expense)
        }

        return expenses
    }

    // Metodo de pesquisar dentro do DB, ele ira retornar um dado para a função abaixo >searchForExpense
    search(expense)
    {
        // Cria um array com todos os items primariamente
        let expensesFiltered = Array()
        // Recebe todas as despesas para poder filtrar
        expensesFiltered = this.loadAllExpenses()

        // O filtro será feito por ordem

        // Ano
        if(expense.year != '')
        {
            expensesFiltered = expensesFiltered.filter(d => d.year == expense.year)
        }

        // Mes
        if(expense.month != '')
        {
            expensesFiltered = expensesFiltered.filter(d => d.month == expense.month)
        }

        // Dia
        if(expense.day != '')
        {
            expensesFiltered = expensesFiltered.filter(d => d.day == expense.day)
        }

        // Tipo
        if(expense.type != '')
        {
            expensesFiltered = expensesFiltered.filter(d => d.type == expense.type)
        }

        // Descrição
        if(expense.description != '')
        {
            expensesFiltered = expensesFiltered.filter(d => d.description == expense.description)
        }

        // Valor
        if(expense.val != '')
        {
            expensesFiltered = expensesFiltered.filter(d => d.val == expense.val)
        }

        return expensesFiltered
    }

    remove(id)
    {
        localStorage.removeItem(id)
    }

}

let db = new Db()

// função desencadeada apos o usuario clicar em +
function registerNewExpense()
{
    let year = document.getElementById('ano')
    let month = document.getElementById('mes')
    let day = document.getElementById('dia')
    let type = document.getElementById('tipo')
    let description = document.getElementById('descricao')
    let val = document.getElementById('valor')

    let expense = new Expense
    (
        year.value,
        month.value,
        day.value,
        type.value,
        description.value,
        val.value,
    )

    // Sistema de persistencia de arquivo no DB do navegador

    // Caso de certo a persistencia de dados
    if(expense.validateData())
    {
        // Comando JQuery para aparecer o Modal
        $('#sucessDbSave').modal('show')

        db.inputToDB(expense)

        // year.value = ''
        // month.value = ''
        // day.value = ''
        type.value = ''
        description.value = ''
        val.value = ''
    }
    // Caso haja alguma incogruencia
    else
    {
        // Comando JQuery para aparecer o Modal
        $('#errorDbSave').modal('show')

        // alert('Dados incorretos')
    }

}

// Funcao responsavel por carregar a lista
function loadExpensesList(expense = Array(), filter = false)
{
    if(expense.length == 0 && filter == false)
    {
        expense = db.loadAllExpenses()
    }

    // console.log(expenses)
   
    // Pega o ID da tabela e começa a configurar ela
    let expenseList = document.getElementById("expenseList")
    
    // <tr>
    // <td>18/05/2020</td>
    // <td>Alimentação</td>
    // <td>Ifood</td>
    // <td>10.75</td>
    // </tr>
    expenseList.innerHTML = ''
    expense.forEach(function(e)
    {
        // Cria o TR
        let line = expenseList.insertRow()

        // Cria os TD
        line.insertCell(0).innerHTML = `${e.day} / ${e.month} / ${e.year} `
        // Ajustar o tipo
        let tempChar = ''

        switch(e.type)
        {
            case '1': 
                tempChar = 'Alimentação'
                break;
            case '2': 
                tempChar = 'Educação'
                break;
            case '3': 
                tempChar = 'Lazer'
                break;
            case '4': 
                tempChar = 'Saúde'
                break;
            case '5': 
                tempChar = 'Transporte'
                break;
            default:
                alert("Ha algo de errado")
                break;
        }

        line.insertCell(1).innerHTML = tempChar
        line.insertCell(2).innerHTML = e.description
        line.insertCell(3).innerHTML = e.val

        //Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${e.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_','')

			db.remove(id)
			window.location.reload()
		}
		line.insertCell(4).append(btn)
    })
}

// Faz a pesquisa de despesas correlacionadas com a busca
function searchForExpense()
{
    // alert("busca concluida")
    // Pega os elementos preenchidos na pagina
    let year = document.getElementById('ano').value
    let month = document.getElementById('mes').value
    let day = document.getElementById('dia').value
    let type = document.getElementById('tipo').value
    let description = document.getElementById('descricao').value
    let val = document.getElementById('valor').value

    // Criação do objeto de pesquisa
    let expense = new Expense(year, month, day, type, description, val)
    // Debugger
    // console.log(expense)

    // O metodo pesquisa via adentrar no banco de dados, na função acima (BD) e recuperar os dados ja persistidos
    let expenseSearch = db.search(expense)

    this.loadExpensesList(expenseSearch, true)
}

