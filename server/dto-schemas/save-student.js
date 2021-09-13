const saveStudent = {
  title: 'Add student form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      description: 'firstName',
      maxLength: 255,
    },
    lastName: {
      type: 'string',
      description: 'lastName',
      maxLength: 255,
    },
    mobileNumber: {
      type: 'string',
      description: 'Mobile number of user',
      pattern: '^[1-9]{1}[0-9]{9}',
      maxLength: 10,
    },
    email: {
      type: 'string',
      description: 'email of the user',
      format: 'email',
    },
    address: {
      type: 'string',
      description: 'address of the user',
      maxLength: 30,
    },
    meetingTime: {
      type: 'string',
      format: 'date-time',
    },
  },
  errorMessage: {
    required: {
      email: 'Parameter: email is required in the body.',
      meetingTime: 'Parameter: meetingTime is required in the body.',
    },
    properties: {
      meetingTime: 'Parameter: meetingTime should be valid.',
      email: 'Parameter: email should be valid.',
    },
  },
  required: [ 'email', 'meetingTime' ],
  additionalProperties: false,
};

module.exports = saveStudent;
