<script>
  export let open = false;

  const toggle = () => (open = !open);
</script>

<button on:click={toggle}><slot name="button">Open</slot></button>

<dialog {open}>
  <slot name="content"></slot>
</dialog>

