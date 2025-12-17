<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg
        :class="{'is-active':isActive}"
        class="hamburger"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        width="54"
        height="54"
    >
      <path
          d="M110.9 128.34a32 32 0 0 1 32-32h773a32 32 0 0 1 0 64h-773a32 32 0 0 1-32-32z m4.58 402.15L260 651.38c15.62 13.07 39.4 2 39.4-18.41V391.19c0-20.37-23.78-31.48-39.4-18.41L115.48 493.67a24 24 0 0 0 0 36.82z m800.41-50.41H405.54a32 32 0 1 0 0 64h510.35a32 32 0 0 0 0-64z m0 383.58h-773a32 32 0 1 0 0 64h773a32 32 0 0 0 0-64z"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
