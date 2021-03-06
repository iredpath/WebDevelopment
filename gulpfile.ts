/// <reference path="./node_modules/gulpclass/index.d.ts" />
/// <reference path="./typings/main.d.ts" />
import { Gulpclass, SequenceTask, Task } from "gulpclass/Decorators";

import * as gulp from 'gulp'
import * as del from 'del'
import * as ts from 'gulp-typescript'
import * as sourcemaps from 'gulp-sourcemaps'

@Gulpclass()
export class Gulpfile {

    @Task("clean")
    clean() {
        return del('dist')
    }

    @Task("build:assets")
    buildAssets() {
        return gulp.src('public/project/assets/**/*.png')
            .pipe(gulp.dest('dist/project/assets'))
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

    @Task("build:data")
    buildData() {
        return gulp.src('server/models/**/*.json')
            .pipe(gulp.dest('dist/models'))
    }

    @Task("build:projectData")
    buildProjectData() {
        return gulp.src('server/project/data/*.json')
            .pipe(gulp.dest('dist/project/data'))
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
        return ["clean", "build:server", "build:assets", "build:data", "build:projectData", "build:public"]
    }

    @SequenceTask("default")
    default() {
        return ["build"]
    }

}