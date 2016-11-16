import surge from 'gulp-surge';

export default function surgeTask() {
    return surge({
        project: './public',
        domain: 'https://md-portfolio.surge.sh',
    });
}
