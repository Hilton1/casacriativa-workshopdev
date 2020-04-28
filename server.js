// usei o express para criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")

// Configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

// habilitar uso do request.bory
server.use(express.urlencoded({ extended: true }))


// Configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

// criei uma rota /
// e capturo o pedido do cliente para responder
server.get("/", function(require, response) {


    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return response.send("Erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse()

        let lestIdeas = []
        for (let idea of reversedIdeas) {
            if (lestIdeas.length < 2) {
                lestIdeas.push(idea)
            }
        }
        return response.render("index.html", { ideas: lestIdeas })

    })
})

server.get("/ideias", function(require, response) {
    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return response.send("Erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse()
        return response.render("ideias.html", { ideas: reversedIdeas })
    }) 
})

server.post("/", function(request, response) {
    // Inserir dados na tabela

    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?,?,?,?,?);
    `
    
    const values = [
        request.body.image,
        request.body.title,
        request.body.category,
        request.body.description,
        request.body.link
    ]

    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return response.send("Erro no banco de dados!")
        }

        return response.redirect("/ideias")
    })
})

// Liguei meu servidor na porta 3000
server.listen(3000);