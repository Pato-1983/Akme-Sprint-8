const db = require ("../../database/models")
const Op = db.Sequelize.Op



const controller = {

    list: async (req, res) => {

        try {

            
            const productos = await db.Product.findAll({include:[db.Category, db.Color]})
            const categories = await db.Category.findAll()
            let countByCategory = {}
            

            countByCategory.proteccionRespiratoria = await db.Product.count({where: { categoryId: 1 }})
            countByCategory.proteccionAuditiva = await db.Product.count({where: { categoryId: 2 }})
            countByCategory.protecciónVisual = await db.Product.count({where: { categoryId: 3 }})
            countByCategory.guantes = await db.Product.count({where: { categoryId: 4 }})
            countByCategory.detectores = await db.Product.count({where: { categoryId: 5 }})
            countByCategory.ropaDeTrabajo = await db.Product.count({where: { categoryId: 6 }})
            countByCategory.filtros = await db.Product.count({where: { categoryId: 7 }})
            countByCategory.total = categories.length
            
            
            let products = []

            productos.forEach(product =>{
                products.push({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    características: [product.Category.name, product.Color.name],
                    detail:`https://akmesprint8.herokuapp.com/productos/detail/${product.id}`
                })
            })

            return res.status(200).json({
                    count: productos.length, 
                    countByCategory,
                    products,
                    
                })
            
        
        } catch (error){
            
            res.status(500).json({ error: error.message })
        }

    },

    detail: async (req,res) => {

        try{


            const id = +req.params.id;
            const product = await db.Product.findByPk(id, {
                include: [{model: db.Color}, {model: db.Category}, {model: db.Image}]
            })

            let imageUrl = `/images/${product.Images[0].name}`

            let respuesta = {
                meta: {
                    status: 200,
                    url: `/productos/${id}`,
                },
                data: product
            }

            res.status(200).json({respuesta, imageUrl})
        
        }catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    lastProduct: async (req, res) => {

        try {
            let products = await db.Product.findAll({include:[db.Category, db.Color, db.Image],
                order: [
                    ['id', 'DESC'],
                ]}
            )

            let product = products[0]
        
            data = {
                product,
                imgUrl : `https://akmesprint8.herokuapp.com/images/${product.Images[0].name}`,
                url: `https://akmesprint8.herokuapp.com/products/detail/${product.id}`
            }
            res.status(200).json({data}) 
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    search: async (req, res) => {
        
        try {  
            

            let meta = {status:'success', length:0}

            let products = await db.Product.findAndCountAll({include:[db.Category, db.Color, db.Image],
                where: {
                    name: {[Op.like] : '%' + req.query.keyword + '%'}
                },
            })

            console.log(products)

            meta.length = products.count
            
            let data = []

            products.rows.forEach(product =>{
                 data.push({
                    product,
                    imgUrl : `https://akmesprint8.herokuapp.com/images/${product.Images[0].name}`,
                    url: `https://akmesprint8.herokuapp.com/products/detail/${product.id}`
                })
            })

            res.status(200).json({meta, data})

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = controller;