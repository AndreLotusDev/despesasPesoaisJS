// Classe que cria o objeto de despesa
class Expense
{
    constructor(ano, mes, dia, tipo, descricao, valor)
    {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
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

            expenses.push(expense)
        }

        return expenses
    }
}

let db = new Db()

// função desencadeada apos o usuario clicar em +
function registerNewExpense()
{
    let ano =document.getElementById('ano')
    let mes =document.getElementById('mes')
    let dia =document.getElementById('dia')
    let tipo =document.getElementById('tipo')
    let descricao =document.getElementById('descricao')
    let valor =document.getElementById('valor')

    let expense = new Expense
    (
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value,
    )

    // Sistema de persistencia de arquivo no DB do navegador

    if(expense.validateData())
    {
        // Comando JQuery para aparecer o Modal
        $('#sucessDbSave').modal('show')

        db.inputToDB(expense)
    }
    else
    {
        // Comando JQuery para aparecer o Modal
        $('#errorDbSave').modal('show')

        // alert('Dados incorretos')
    }

}

// Funcao responsavel por carregar a lista
function loadExpensesList()
{
    let expenses = Array() 
    expenses = db.loadAllExpenses()

    // console.log(expenses)

    // Pega o ID da tabela e começa a configurar ela
    var expenseList = document.getElementById("expenseList")
    
    // <tr>
    // <td>18/05/2020</td>
    // <td>Alimentação</td>
    // <td>Ifood</td>
    // <td>10.75</td>
    // </tr>

    expenses.forEach(function(e)
    {
        // Cria o TR
        let line = expenseList.insertRow()

        // Cria os TD
        line.insertCell(0).innerHTML = `${e.dia} / ${e.mes} / ${e.ano} `
        // Ajustar o tipo
        switch(e.tipo)
        {
            case 1: 'Alimentação'
            case 2: 'Educação'
            case 3: 'Lazer'
            case 4: 'Saúde'
            case 5: 'Transporte'
        }

        line.insertCell(1)
        line.insertCell(2)
        line.insertCell(3)
    })
}

