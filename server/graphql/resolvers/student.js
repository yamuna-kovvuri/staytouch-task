const { Student: StudentService } = require('../../services');
const {
  saveStudent: saveStudentSchema, getPublicId: getPublicIdSchema, getStudents: getStudentsSchema,
} = require('../../dto-schemas');
const Validator = require('../../utils/validator');

const getList = async (_, args, context) => {
  try {
    const { headers: { authorization } } = context;
    const {
      pageNumber: pageNumberValue, pageSize: pageSizeValue, sorting, filters,
    } = args;

    const pageNumber = pageNumberValue || 1;
    const pageSize = pageSizeValue || 100;
    const data = {
      filters, sorting, pageNumber, pageSize,
    };
    const limit = pageSize;
    const offset = limit * (pageNumber - 1);

    const { errors } = Validator.isSchemaValid({ data, schema: getStudentsSchema });

    if (errors) {
      return { errors };
    }

    const { doc, count, errors: err } = await StudentService.getList({ ...data, limit, offset }, authorization);

    return {
      data: doc,
      pageInfo: {
        totalRecords: count, pageLimit: limit,
      },
       errors: err,
    };
  } catch (error) {
    return error;
  }
};

const getDetailById = async (_, args, context) => {
  try {
    const { headers: { authorization } } = context;
    const { publicId } = args;

    const { doc, errors } = await StudentService.getDetailById({ publicId }, authorization);

    if (errors) {
      return { errors };
    }

    return { data: doc };
  } catch (error) {
    return error;
  }
};

const save = async (_, args, context) => {
  try {
    const { headers: { authorization } } = context;
    const { input } = args;
    const data = {
      ...input,
    };

    const { errors } = Validator.isSchemaValid({ data, schema: saveStudentSchema });

    if (errors) {
      return { errors };
    }

    const { errors: err, doc } = await StudentService.save(data, authorization);

    if (doc) {
      return { data: doc };
    }

    return { errors: err };
  } catch (error) {
    return error;
  }
};

const patch = async (_, args, context) => {
  try {
    const { headers: { authorization } } = context;
    const { input, publicId } = args;

    const data = { ...input, publicId };

    const { errors: err, doc } = await StudentService.patch(data, authorization);

    if (doc) {
      return { data: doc };
    }

    return { errors: err };
  } catch (error) {
    return error;
  }
};

const deleteStudent = async (_, args, context) => {
  try {
    const { headers: { authorization } } = context;
    const { input, publicId } = args;

    const data = { ...input, publicId };
    const { errors } = Validator.isSchemaValid({ data, schema: getPublicIdSchema });

    if (errors) {
      return { errors };
    }

    const { errors: err, doc } = await StudentService.deleteStudent(data, authorization);

    if (doc) {
      return { data: doc };
    }

    return { errors: err };
  } catch (error) {
    return error;
  }
};

module.exports = {
  Query: {
    GetStudent: getDetailById,
    GetStudents: getList,
  },
  Mutation: {
    AddStudent: save,
    UpdateStudent: patch,
    DeleteStudent: deleteStudent,
  },
};
