<script>
    import MenuIcon from "./components/MenuIcon.svelte";
    import Toggle from "./components/Toggle.svelte";

	let hideMenu = true;
    function toggleMenu() {
        hideMenu = !hideMenu;
    }
    export let onlyBubblers = false;
</script>

<div class="menu">
    <div class="menu-button">
        <MenuIcon toggleMenu={toggleMenu} open={!hideMenu}/>
    </div>
    <div class="menu-content" class:hide={hideMenu}>
        <ul>
            <li><Toggle label="only bubblers" bind:checked={onlyBubblers}/></li>
            <li>&nbsp;</li>
            <li><a href="https://github.com/sw-fox/owm"><img class="github-mark" src="images/github-mark.svg" alt=""/>Github</a></li>
        </ul>
      </div>
</div>

<style>
    .menu {
        position: absolute;
        overflow: hidden;
        top: 0;
        right: 0;
        z-index: 999;
        display: flex;
        flex-direction: column;
    }
    .menu-button {
        margin-left: auto;
        margin-right: 0;
    }
    .menu-content {
        width: 40vw;
        overflow: hidden;
        background-color: #333;
        color: #ddd;
        margin-left: auto;
        margin-right: 0;
        transition: transform 1s ease-in-out;
    }
    @media (max-width: 1000px) {
        .menu-content {
            width: 70vw;
        }
    }
    @media (max-width: 600px) {
        .menu-content {
            width: calc(100vw - 3em);
        }
    }
    .menu-content.hide {
        transform: translateX(100%);
    }
    .menu-content ul {
        margin-top: 2em;
        margin-bottom: 2em;
        list-style: none;
    }
    .menu-content li {
        margin-top: 0.5em;
        font-size: 1.2rem;
    }
    .menu-content a {
        color: #ddd;
    }
    .github-mark{
        width: 1em;
        margin-right: 0.3em;
    }
</style>
