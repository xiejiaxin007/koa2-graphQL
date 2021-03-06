/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 21:19:28
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-06 23:30:20
 * @description: BBS接口测试
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
import axios from './axios.js';

// 获取用户信息接口
const getMenuInfo = () => {
    return axios.post('/api/bbs-api-user/menu');
};

// 菜单信息
const MenuType = new GraphQLObjectType({
    name: 'MenuType',
    fields: {
        active: {
            type: GraphQLString
        },
        track_url: {
            type: GraphQLString
        },
        track_common_property: {
            type: new GraphQLObjectType({
                name: 'TrackType',
                fields: {
                    city_id: {
                        type: GraphQLInt
                    }
                }
            })
        }
    }
});
// 基础信息
const PageInfoType = new GraphQLObjectType({
    name: 'PageInfoType',
    fields: {
        employee_name: {
            type: GraphQLString
        },
        job_number: {
            type: GraphQLInt
        },
        photos_route: {
            type: GraphQLString
        },
        menu: {
            type: MenuType,
            async resolve() {
                let { data } = await getMenuInfo();
                return data.data;
            }
        }
    }
});

const schema = new GraphQLSchema({
    // 查询
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            test: {
                type: GraphQLString,
                resolve() {
                    return 'success';
                }
            },
            info: {
                type: PageInfoType,
                async resolve() {
                    let { data } = await axios.get('/api/bbs-api-user/info');
                    return data.data;
                }
            }
        }
    })
});

export default schema;