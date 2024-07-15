import { NodeName, NodeNameEnum } from "../../../models/constants"
import type { IconNode, IconType } from "../../../models/icon"
import { type IComponent } from "./interfaces"

export class Icon implements IconNode, IComponent<IconNode> {
  nodeName: NodeName = NodeNameEnum.Icon
  type: IconType
  value: string

  constructor(model: IconNode) {
    this.type = model.type
    this.value = model.value
  }

  toModel(): IconNode {
    return {
      nodeName: this.nodeName,
      type: this.type,
      value: this.value
    }
  }
}
