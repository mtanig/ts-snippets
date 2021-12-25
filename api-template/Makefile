build:
	npm run build

start:
	npm run start

dev:
	npm run dev

test:
	npm run test

yaml_to_dotenv:
	@node -e 'let envs=require("js-yaml").load(require("fs").readFileSync(".env.yaml","utf8"));Object.keys(envs).forEach(key=>{console.log(key + "=" + JSON.stringify(envs[key]))});' > .env
