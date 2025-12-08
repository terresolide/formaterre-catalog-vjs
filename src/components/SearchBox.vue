<template>
<span class="formater-search-box" v-bind:class="{ showBody: isdeployed, 'partial-disable': disableLevel === 1, disable: disableLevel ===2 }">
<div id="main" class="box noselect">
<header class="box-heading" v-on:click="isdeployed = !isdeployed" :style="{background: type === 'fill' ? 'var(--color-primary)': 'var(--color-background-mute)', color: type === 'fill' ? 'var(--color-white)': 'var(--color-text-primary)'}">
  <div class="box-title">
     <div class="box-heading-buttons fmt-before" v-if="type != 'fill'">
        <font-awesome-icon class="chevron" :icon="openIconClass"/>
     </div>
     <div class="box-heading-buttons">
        <font-awesome-icon :icon="headerIconClass"/>
     </div>
     <h4 no-label-float>{{title}}</h4>
  </div>
  <div class="box-heading-buttons" v-if="type === 'fill'">
    <font-awesome-icon class="chevron" :icon="openIconClass"/>
  </div>
 </header>
 <div id="collapse" class="box-collapsable-part">
  <main class="box-body">
    <div class="content" :class="mainClass">
      <slot></slot>
    </div>
  </main>
</div>
</div>
</span>
</template>

<script>
export default {
  props: {
    headerIconClass:  {
      type: String,
      default: 'fa-solid fa-search'
    },
    deployed:  {
        type: Boolean,
        default: false
    },
    openIconClass:  {
        type: String,
        default: 'fa-solid fa-caret-right'
    },
    title:  {
        type: String,
        default: ''
    }, 
    type: {
        type: String,
        default: 'fill'
    },
    mainClass: {
    	type: String,
    	default: ''
    },
    disableLevel: {
        type: Number,
        default: 0
    },
    color: {
      type: String,
      default: 'var(--color-text)'
    }
    
  },
  
  watch: {
  },
  created: function () {
   this.isdeployed = this.deployed
  },
   data () {
    return {
    	hasToolbar: false,
    	isdeployed: null
    }
  },

  methods: {
  
  }
}
</script>

<style>

.formater-search-box .box-collapsable-part {
    display: none;
    transition: 0.3s
}

.formater-search-box.showBody .box-collapsable-part {
    display: block;
    transition: 0.3s
}
.formater-search-box:not(.disable).showBody .chevron {
   transform: rotate(90deg);
}
.formater-search-box .chevron {
    transition: 0.3s;
}


.formater-search-box {
    box-sizing: border-box;
    position: relative;
    display: block;
    width:auto;
    margin: 1px 0;
    transition: transform 4s ease-out;
}
.formater-search-box:hover {
    cursor: default
}
.formater-search-box .box {
    box-sizing: border-box;
    width: 100%;
    color: var(--color-text, #333);
    background-color: var(--color-background, #fff)
}
.formater-search-box .box-title {
    display: flex;
    font-size: 16px;
    font-weight:700;
    line-height: 1.2
}


.formater-search-box header {
	color:var(--color-background);
}

.formater-search-box .box-title h4 {
    margin: 0;
    font-size: 1.1em;
    font-weight:500;
}
.formater-search-box .box-title h4::first-letter{
	text-transform:uppercase;
}
.formater-search-box .box-body {
    font-size: 14px;
    word-wrap: break-word
}
.formater-search-box .box-body .content {
    padding: 10px;
    text-align: justify
}
.formater-search-box .box-toolbar {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
    border: var(--color-border);
    background-color: var(--color-background-mute, #fafafa)
}
.formater-search-box .box-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: var(--color-background-mute, #f5f5f5);
    border: var(--catalog-box-header-border, none);
    cursor: pointer;
    pointer-events: auto;
    opacity: 1;
}
.formater-search-box.disable .box-heading {

    cursor: none;
    pointer-events: none;
    opacity: 0.7;
}
.formater-search-box.partial-disable .box-heading {
    opacity: 0.7;
}
.formater-search-box .box-heading .box-heading-buttons {
    display: flex;
    flex-flow: row nowrap;
    font-size:1.1em;
    width:25px;
}
.formater-search-box .box-heading .box-heading-buttons.fmt-before {
    width:15px;
}
.formater-search-box .box-collapsable-part {
    border: var(--catalog-box-main-border, none)
}



 </style>