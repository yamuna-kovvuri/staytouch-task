const { filterFields } = require('./filter');

module.exports = `
    enum KEY_FIELD{
        publicId
        firstName
        lastName
        email
        mobileNumber
        address
        meetingTime
    }
    
    input STUDENT_SORT{
        key: KEY_FIELD!
        direction: SORT_ORDER!
    }
    
    input STUDENT_FILTER{
        key: KEY_FIELD!
        ${filterFields}
    }
 
    input STUDENT_INPUT {
        firstName: String
        lastName: String
        email: String
        mobileNumber: String
        address: String
        meetingTime: DateTime
    }

    type STUDENT{
        publicId: UUID
        firstName: String
        lastName: String
        email: String
        mobileNumber: String
        address: String
        meetingTime: DateTime
    }

    type STUDENT_DETAILS {
        data: STUDENT
        errors: [ error ]
    }

    type STUDENT_DETAILS_LIST {
        data: [ STUDENT ]
        pageInfo: PAGE_INFO
        errors: [ error ]
    }

    type Query {    
        GetStudent(publicId: UUID): STUDENT_DETAILS
        GetStudents(pageNumber: Int,pageSize: Int,sorting: [STUDENT_SORT],filters: [STUDENT_FILTER]): STUDENT_DETAILS_LIST
    }

    type Mutation {
        AddStudent(input: STUDENT_INPUT): result
        UpdateStudent(publicId: UUID!, input: STUDENT_INPUT): result
        DeleteStudent(publicId: UUID!): result
    }
`;
