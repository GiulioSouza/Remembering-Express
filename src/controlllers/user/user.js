const db = require("../../dbConfig/db")

const getUsers = async (req, res) => {
    try {
      const users = await db('users').select('*');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };

const getUserByID = async(req, res) => {
  const { id } = req.params
  try {
    const user = await db("users").where({ id }).first()

    if(!user) {
      return res.status(404).json( "user not found " )
    }
    return res.json( user )
  } catch {
    res.status(500).json({ error: 'Failed to fetch user ID' });
  }
}

const createUser = async(req, res) => {
  const { name, email } = req.body
  const created_at = new Date()
  const updated_at = new Date()

  const emailExists = await db("users").where({ email }).first()
  if(emailExists) return res.status(500).json({ error: 'Email already registered' });
  
  
  try {
      const [id] = await db('users').insert({ name, email, created_at, updated_at }).returning('id');
      res.status(201).json( id );
    } catch (err) {
      res.status(500).json({ error: 'Failed to create user' });
  }
}

const updateUser = async(req, res) => {
  const { id } = req.params
  const { name, email } = req.body
  const updated_at = new Date()

  if(!id) {
    return res.status(400).json( "It's necessary an ID to update user")
  }

  const checkExistingEmail = await db("users").select("*").where({ email }).andWhereNot({id}).first()
  
  if (checkExistingEmail) {
    return res.status(400).json({ "problem": "This email already belongs to another user" });
  }

  const user = await db("users").where({ id }).first()

  if(!user) {
    return res.status(404).json("user not found")
  }

  await db("users").where({id}).update({ name, email, updated_at })
  
  const updatedUser = await db("users").where({ id }).first()

  return res.status(200).json({ "user updated with sucess": updatedUser })
}

const suspendUser = async(req,res) => {
  const {id} = req.params
  const user = await db('users').where({id});

  if(!user) {
    res.status(404).json({"error": "user not found"})
  }

  try {
    await db("users").where({id}).update({ active: false})

    return res.status(200).json("User suspended with success")
  } catch {
    return res.status(500).json({ "error": "Something went wrong." })
  }
}

module.exports = {
    getUsers,
    getUserByID,
    createUser,
    updateUser,
    suspendUser
}