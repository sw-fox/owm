<script>
    export let message = "";
    export let show = false;
</script>
{#if show}
<div class="banner-position">
    <div class="banner">{message}</div>
</div>
{/if}

<style>
    .banner-position{
        position: absolute;
        top: 1em;
        z-index: 999;
        width: 60vw;
        padding: 0 20vw;
    }
    .banner{
        background-color: #555;
        width: fit-content;
        color: #ddd;
        padding: 1em;
        margin: 0 auto;
    }
</style>