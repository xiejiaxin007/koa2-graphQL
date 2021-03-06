/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 21:19:28
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-06 21:23:28
 * @description: file content
 */
import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
} from 'graphql';

import axiosApi from 'axios';
// 设置接口请求域名
let axios = axiosApi.create({
    baseURL: 'http://test24backend.comjia.com'
})
// 登录cookie保存
let cookieVal;

// 登录接口
const loginInfo = () => {
    return axios.post('/backend-api/api-user/login', {
        job_number: '25',
        password: "Julive@666"
    })
}
// 切换身份接口 
const switchRole = (req) => {
    return axios.post('/backend-api/common/switch-role', {
        role_name: 'super_admin'
    });
};

// 选中内容
const ChosenType = new GraphQLObjectType({
    name: 'ChosenType',
    fields: {
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        }
    }
});
// 标签组数据对象
const TagGroupType = new GraphQLObjectType({
    name: 'TagGroupType',
    fields: {
        checked: {
            type: GraphQLBoolean
        },
        type_id: {
            type: GraphQLInt
        },
        type_name: {
            type: GraphQLString
        },
        // 默认选种值
        chosen: {
            type: ChosenType,
            async resolve(obj) {
                let { data } = await axios.get('/backend-api/project/project-profile/get-info', {
                    params: {
                        project_id: '200488410'
                    }
                });
                const tagObj = data.data.project_survey_tag_info.data.tag.field_value[obj.type_id];
                // 判断是多选还是单选
                if (obj.checked && tagObj) {
                    // 多选
                    let idArr = [];
                    let nameArr = [];
                    tagObj.values.forEach(item => {
                        idArr.push(item.value);
                        nameArr.push(item.name);
                    });
                    return {
                        id: idArr.join(','),
                        name: nameArr.join('，')
                    }
                } else if (!obj.checked && tagObj) {
                    return {
                        id: tagObj.values.value,
                        name: tagObj.values.name
                    }
                } else {
                    return {
                        id: '',
                        name: ''
                    }
                }
            }
        }
    }
});

const schema = new GraphQLSchema({
    // 查询
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            hello: {
                type: GraphQLString,
                resolve() {
                    return 'world';
                }
            },
            tags: {
                type: new GraphQLList(TagGroupType),
                async resolve() {
                    let result = await loginInfo();
                    cookieVal = result.headers['set-cookie'];
                    // 设置请求cookie
                    axios.defaults.headers['cookie'] = cookieVal
                    await switchRole();
                    let { data } = await axios.get('/backend-api/project/tags');
                    return data.data;
                }
            }
        }
    })
});

export default schema;