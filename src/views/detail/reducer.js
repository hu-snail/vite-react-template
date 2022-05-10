
export default function reducer(state = initialState, action) {
    const {type, payload} = action
    switch (type) {
        case 'setNodeOptions':
            const {nodeOptions} = payload
            return Object.assign(state, {nodeOptions})
        case 'setCurrentNodeKey':
            const {currentNodeKey} = payload
            return Object.assign(state, {currentNodeKey})
        default:
        throw new Error();
    }
}
