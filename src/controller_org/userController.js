import User from '../schema/User.js'

const getAllUser = async (req, res) => {
  try {
    const user = await User.find()

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.params

  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const addUser = async (req, res) => {
  try {


  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params

  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export { getAllUser, getUserById, addUser, updateUser, deleteUser, }