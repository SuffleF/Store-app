import { sql } from '../config/db.js'

// Get all products process
export const getProducts = async (req, res) => {

    try {
        const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `
        console.log("fetched products", products)
        res.status(200).json({ success: true, data: products })
    } 
    
    catch (error) {
        console.log("Error in getProducts", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

// Get single product process
export const getProduct = async (req, res) => {
    const { id } = req.params

    if(!id) {
        return res.status(400).json({ success: false, message: "Product ID is required" })
    }

    try {
        const product = await sql `
        SELECT * FROM products WHERE id = ${id}
        `
        console.log("fetched product", product)
        res.status(200).json({ success: true, data: product[0] })
    } 
    
    catch (error) {
        console.log("Error in getProduct", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}

// Create new product process
export const createProduct = async (req, res) => {

    const { name, image, price } = req.body

    if(!name || !image || !price) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }

    try {
        const newProduct = await sql `
        INSERT INTO products (name, image, price)
        VALUES (${name}, ${image}, ${price})
        RETURNING *
        `
        console.log("New product added", newProduct)
        res.status(201).json({ success: true, data: newProduct[0] })
    } 
    
    catch (error) {
        console.log("Error in createProduct", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

// Update Product process
export const updateProduct = async (req, res) => {
    const { id } = req.params
    const { name, image, price } = req.body

    try {
        const updateProduct = await sql`
        UPDATE products SET name = ${name}, image = ${image}, price = ${price}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}
        RETURNING *
        `
        if(updateProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        console.log("Current product updated", updateProduct)
        res.status(201).json({ success: true, data: updateProduct[0] })
    } 
    
    catch (error) {
        console.log("Error in updateProduct", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}

// Delete Product process
export const deleteProduct = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Product ID is required" })
    }

    try {
        const deletedProduct = await sql`
        DELETE FROM products WHERE id = ${id} RETURNING *
        `
        if(deletedProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        console.log("deleted product", deletedProduct)
        res.status(200).json({ success: true, data: deleteProduct[0] })
    } 
    
    catch (error) {
        console.log("Error in deleteProduct", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}