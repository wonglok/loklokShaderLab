<template>
<div class="group">
  <div class="box-connector box-group-1" :class="{ [ballsMode]: true}" :key="ballKey" v-for="(ball, ballKey) in getBallsModeOfConnectorGroup(conntGp.id, ballsMode)">
    <draggable :class="{ 'has-two': hasTwo(ball.items) }" :style="ball.style" class="connector" :ref="ball.id" :options="{group: { name: 'connectors', pull: 'clone', put () { return hasOne(ball.items) && ballsMode === 'ballsIn' } }}" v-model="ball.items" @change="() => { $nextTick(() => { $forceUpdate() })  }">
      <div class="drag-handler" @click="() => { removePair(ball); }" v-for="(item, index) in ball.items" :key="index">
        {{ ball.label }}
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
    ballsMode: {},
    removePair: {}
  },
  watch: {
    balls () {
      this.$nextTick(() => {
        this.$emit('mergeRefs', this.$refs)
      })
    },
    connectorGroups () {
      this.$nextTick(() => {
        this.$emit('mergeRefs', this.$refs)
      })
    }
  },
  mounted () {
    this.$emit('mergeRefs', this.$refs)
  },
  components: {
    draggable
  },
  computed: {
  },
  methods: {
    getBallsModeOfConnectorGroup (boxID, mode) {
      return this.connectorGroups.filter((box) => {
        return box.id === boxID
      })[0][mode]
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

  background: white;

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

  background-image: linear-gradient(45deg, rgba(100,100,100,0.9), rgba(255,255,255,0.9));

  border-radius: 50%;
  border: #bababa solid 3px;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.ballsIn .drag-handler{
  background-image: linear-gradient(45deg, rgba(255, 166, 32, 0.9), rgba(255,0,255,0.9));
  color: white;
}
.ballsOut .drag-handler{
  background-image: linear-gradient(45deg, rgba(12, 191, 42, 0.9), rgba(0, 232, 255, 0.9));
  color: white;
}
.has-two .drag-handler {
  background-image: linear-gradient(45deg, rgba(27, 255, 244, 0.9), rgba(204, 0, 255, 0.9));
  color: white;
}

.box-connector{
  display: inline-block;
}

</style>