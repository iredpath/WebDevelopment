/// <reference path="./node_modules/gulpclass/index.d.ts" />
/// <reference path="./typings/main.d.ts" />
import {Gulpclass, SequenceTask, Task} from "gulpclass/Decorators";

import * as gulp from 'gulp'
import * as del from 'del'
import * as ts from 'gulp-typescript'
import * as sourcemaps from 'gulp-sourcemaps'
import * as runSequence from 'run-sequence'

@Gulpclass()
export class Gulpfile {

    @Task("clean")
    clean() {
        return del('dist')
    }

    @Task("build:server")
    buildServer() {
        const tsProject = ts.createProject('server/tsconfig.json')
        const tsResult = gulp.src('server/**/*.ts')
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist'))
        return tsResult
    }

    @Task("build:index")
    buildIndex() {
        const html = gulp.src('public/index.html')
            .pipe(gulp.dest('dist'))
        const css = gulp.src('public/css/*.css')
            .pipe(gulp.dest('dist/css'))
        return [html, css]
    }

    @Task("build:public")
    buildPublic() {
        const tsProject = ts.createProject('public/tsconfig.json')
        const tsResult = gulp.src('public/**/*.ts')
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .js
            .pipe(gulp.dest('dist'))
        const html = gulp.src('public/**/*.html')
            .pipe(gulp.dest('dist'))
        const css = gulp.src('public/**/*.css')
            .pipe(gulp.dest('dist'))
        return [tsResult, html, css]
    }

    @SequenceTask("build")
    build() {
        return ["clean", "build:server", "build:public"]
    }

    @Task("default")
    default() {
        return ["build"]
    }

}