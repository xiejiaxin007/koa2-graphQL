/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 21:19:28
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-15 08:27:52
 * @description: 支撑系统接口测试，对应的启动文件是test.js
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
// 菜单对象
const MenuType = new GraphQLObjectType({
    name: 'MenuType',
    fields: {
        id: {
            type: GraphQLString
        },
        is_out_url: {
            type: GraphQLString
        },
        menu_name: {
            type: GraphQLString
        },
        menu_url: {
            type: GraphQLString
        },
        pid: {
            type: GraphQLString
        },
        role: {
            type: new GraphQLList(GraphQLString)
        },
        route: {
            type: new GraphQLList(GraphQLString)
        },
        show_index: {
            type: GraphQLString
        },
        track_id: {
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
        // }
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
            // tags: {
            //     type: new GraphQLList(TagGroupType),
            //     async resolve() {
            //         await switchRole();
            //         let { data } = await axios.get('/backend-api/project/tags');
            //         return data.data;
            //     }
            // },
            menu: {
                type: new GraphQLList(MenuType),
                async resolve() {
                    let { data } = await axios.post('/backend-api/api-user/menu');
                    const menuObj = data.data.menu;
                    let arr = [];
                    Object.keys(menuObj).forEach(item => {
                        arr.push(menuObj[item]);
                    });
                    return arr;
                }
            }
        }
    })
});

export default schema;