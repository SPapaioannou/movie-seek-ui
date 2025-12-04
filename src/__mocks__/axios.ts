const get = jest.fn();
const create = jest.fn(() => ({ get }));

const axios = {
    get,
    create,
};

export default axios;