import surge from 'gulp-surge';

export default function ghPages() {
    return surge({
        project: './public',
        domain: 'https://md-portfolio.surge.sh',
    });
}
