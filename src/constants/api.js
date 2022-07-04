const employee = {
    get: 'emp/{id}',
    post: 'emp',
    postupdate: 'emp/update/{id}',
    insert: 'emp/create',
    delete: 'emp/delete'
};

const organization = {
    get: 'org',
    _delete: 'org/delete',
    update: 'org/update/{id}',
    insert: 'org/create',
    getInfo: 'org/{id}',
    GetComboBoxProvince: 'com/all-province',
    GetComboBoxDistrict: 'com/get-dist-by-prov/{id}',
    GetComboBoxWard: 'com/get-ward-by-dist/{id}'
}

const contracts = {
    get: 'contracts/get?page={page}&pageSize={pageSize}&FromDate={FromDate}&ToDate={ToDate}&Status={Status}',
    getinfomess: 'messages/getinfo_messagestwo?id={id}',
    winner: 'contract_disputes/winner0',
    getContract_disputes: 'contract_disputes/getinfocontract_disputes?ID={ID}',
    getinfo_messagesthree: 'messages/getinfo_messagesthree?id={id}',
    getinfonew: 'news/getinfonew?id={id}',
    sendmessages: 'messages/sendmessages',
    getprocessed: 'messages/getprocessed',
    _delete: 'contracts/delete',
    update: 'contracts/update',
    insert: 'contracts/create',
    getInfo: 'news/getinfonew/id={id}',
}

export {
    employee,
    organization,
    contracts,
 
};
