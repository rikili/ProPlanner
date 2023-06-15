const initialState = {
    userList: ['User A', 'User B'],
    pollList: [
        {
            question: 'Whistler or Kelowna?',
            optionList: [
                {
                    option: 'Whistler',
                    count: 0
                },
                {
                    option: 'Kelowna',
                    count: 0
                },
                {
                    option: 'Victoria',
                    count: 0
                }

            ]
        },
        {
            question: 'What should we eat tonight?',
            optionList: [
                {
                    option: 'Pizza',
                    count: 0
                },
                {
                    option: 'Burger',
                    count: 0
                },
                {
                    option: 'Sushi',
                    count: 0
                }
            ]
        }
    ]
}

export default initialState;