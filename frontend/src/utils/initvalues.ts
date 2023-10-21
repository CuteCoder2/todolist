import * as Yup from 'yup'

const searchSchema = Yup.object().shape({
    name: Yup.string().required()
})

const searchInitValues = {
    name: ""
}

export {
    searchSchema,
    searchInitValues
}