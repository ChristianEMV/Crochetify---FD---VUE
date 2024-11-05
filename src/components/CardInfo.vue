<template>
  <div class="col-sm-3">
    <div class="card">
      <div class="card-body" :style="{ borderLeft: `solid 25px ${borderColor}` }">
        <div class="row">
          <div class="col-sm-8">
            <h1>{{ isCurrency ? `$${count.toLocaleString()}` : count }}</h1>
            <h6 class="title">{{ title }}</h6>
            <p class="text">{{ description }}</p>
          </div>
          <div class="col-sm-4 d-flex align-items-center justify-content-center">
            <i :class="['bi', icon, 'icon-circle']"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: String,
    count: Number,
    description: String,
    icon: String,
    borderColor: String,
    isCurrency: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped>
.icon-circle {
  color: #ffffff;
  border-radius: 50%;
  padding: 15px;
  font-size: 3em;
}
.title {
  color: black;
  font-weight: bold;
  margin-bottom: 2px;
}
.text {
  color: #c7c7c7;
  font-size: small;
  margin-bottom: 2px;
}
</style>
