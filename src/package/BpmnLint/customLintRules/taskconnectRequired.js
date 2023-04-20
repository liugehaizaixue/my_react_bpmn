const { is } = require("bpmnlint-utils");

module.exports = function () {
  function check(node, reporter) {
    if (!is(node, "bpmn:Task")) {
      return;
    }
    const incoming = node.incoming || [];
    const outgoing = node.outgoing || [];
    if (incoming.length < 1 && outgoing.length < 1) {
      return; //element is not connected
    }

    if (incoming.length < 1 || outgoing.length < 1) {
      reporter.report(node.id, "Task is not connected");
    }
  }

  return { check };
};
