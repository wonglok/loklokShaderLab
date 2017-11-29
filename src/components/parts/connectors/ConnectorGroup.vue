<template>
<div class="group">
  <div class="box-connector box-group-1" :key="ballKey" v-for="(ball, ballKey) in getBallsModeOfConnectorGroup(conntGp.id, ballsMode)">
    <draggable :class="{ 'has-two': hasTwo(ball.items) }" class="connector" :ref="ball.id" :options="{group: { name: 'connectors', pull () { return hasOne(ball.items) }, put () { return hasOne(ball.items) } }}" v-model="ball.items" @start="drag = true" @end="drag = false" @change="() => { $nextTick(() => { $forceUpdate() })  }">
      <div class="drag-handler" @click="() => { removePair(ball); removePair(ball); }" v-for="(item, index) in ball.items" :key="index">
      </div>
    </draggable>
  </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  props: {
    connectorGroups: {},
    balls: {},
    conntGp: {},
    ballsMode: {}
  },
  mounted () {
    this.$emit('mergeRefs', this.$refs)
  },
  components: {
    draggable
  },
  methods: {
    getBallsModeOfConnectorGroup (boxID, mode) {
      return this.connectorGroups.filter((box) => {
        return box.id === boxID
      })[0][mode]
    },
    removePair (ball) {
      var pair = ball.items
      if (pair.length >= 2) {
        pair.forEach((item) => {
          if (item.id !== pair.id) {
            let anotherOne = item
            pair.splice(pair.indexOf(anotherOne), 1)
            let anotherBall = this.balls.filter((ballItem) => {
              return ballItem.id === anotherOne.id
            })[0]
            anotherBall.items.push(anotherOne)
          }
        })
      }
    },
    hasTwo (items) {
      return items.length >= 2
    },
    hasOne (items) {
      return items.length === 1
    }
  }
}
</script>

<style scoped>
.group{
  display: block;
}
.sortable-ghost{
  display: none;
}
.connector{
  margin: 3px;
  position: relative;

  border-radius: 50%;
  border: #bababa solid 3px;

  background-image: white;

  width: 40px;
  height: 40px;
}
.connector.has-two{
  /* background-image: linear-gradient(45deg, red, orange); */
}
.drag-handler{
  position: absolute;
  top: -3px;
  left: -3px;

  width: 40px;
  height: 40px;

  background-image: linear-gradient(45deg, rgba(0,0,0,0.2), rgba(255,255,255,0.2));

  border-radius: 50%;
  border: #bababa solid 3px;
}
.has-two .drag-handler {
  background-image: linear-gradient(45deg, rgba(255,0,0,0.5), rgba(255,0,255,0.5));
}

.box-connector{
  display: inline-block;
}
</style>