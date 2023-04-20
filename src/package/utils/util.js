const customElements = [
  "bpmn:Task",
  "bpmn:StartEvent",
  "bpmn:ServiceTask",
  "bpmn:UserTask",
  "bpmn:SendTask",
]; // 自定义元素的类型
const customConfig = {
  // 自定义元素的配置
  // 'bpmn:Task': {
  //     'url': require('../assets/service.png'),
  //     // 'url': require('../../assets/rules.png'),
  //     // 'url': 'https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png',
  //     'attr': { x: 0, y: 0, width: 48, height: 48 },

  // },
  "bpmn:StartEvent": {
    url: require("../assets/start.png"),
    attr: { x: 0, y: 0, width: 40, height: 40 },
  },

  "bpmn:Task": {
    url: require("../assets/task.png"),
    attr: { x: 0, y: 0, width: 100, height: 80 },
  },
  // "bpmn:ExclusiveGateway": {
  //   url: require("../assets/gateway-xor.png"),
  //   attr: { x: 0, y: 0, width: 50, height: 50 },
  // },
};
const hasLabelElements = [
  "bpmn:StartEvent",
  "bpmn:EndEvent",
  "bpmn:ExclusiveGateway",
]; // 一开始就有label标签的元素类型

export { customElements, customConfig, hasLabelElements };
