/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 21:19:28
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-13 22:22:19
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
import axios from '../../middlewares/http/axios';

// 获取用户信息接口
const getMenuInfo = () => {
    return axios.post('/api/bbs-api-user/menu');
};
// 单个菜单信息
const MenuType = new GraphQLObjectType({
    name: 'MenuType',
    fields: {
        id: {
            type: GraphQLString
        },
        is_new: {
            type: GraphQLInt
        },
        is_out_url: {
            type: GraphQLInt
        },
        menu_name: {
            type: GraphQLString
        },
        menu_url: {
            type: GraphQLString
        },
        show_index: {
            type: GraphQLString
        },
        type: {
            type: GraphQLString
        },
        // child: {
        //     type: new GraphQLList(MenuType),
        //     resolve(obj) {
        //         return obj.child;
        //     }
        // },
        role: {
            type: new GraphQLList(GraphQLString)
        },
        route: {
            type: new GraphQLList(GraphQLString)
        }
    }
});
// 菜单信息
const InfoType = new GraphQLObjectType({
    name: 'InfoType',
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
                    },
                    ip: {
                        type: GraphQLString
                    },
                    login_employee_id: {
                        type: GraphQLInt
                    },
                    product_id: {
                        type: GraphQLInt
                    },
                    role: {
                        type: GraphQLString
                    }
                }
            })
        },
        menu: {
            type: new GraphQLList(MenuType),
            resolve(obj) {
                return obj.menu;
            }
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
        info: {
            type: InfoType,
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