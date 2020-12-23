// main implmenets a rewrite of blog post headers
//
// This is for one time use purpose, please do not use it again.
//
// Author: Changkun Ou
// License: MIT
package main

import (
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
)

type oldh struct {
	Date  string   `yaml:"date"`
	ID    int      `yaml:"id"`
	Path  string   `yaml:"path"`
	Tags  []string `yaml:"tags"`
	Title string   `yaml:"title"`
}

type newh struct {
	Date    string   `yaml:"date"`
	TOC     bool     `yaml:"toc"`
	ID      int      `yaml:"id"`
	Slug    string   `yaml:"slug"`
	Aliases []string `yaml:""`
	Tags    []string `yaml:"tags"`
	Title   string   `yaml:"title"`
}

func main() {
	filepath.Walk("../../content/posts", func(path string, info fs.FileInfo, err error) error {
		if info.IsDir() {
			return nil
		}

		b, err := os.ReadFile(path)
		if err != nil {
			panic(err)
		}

		s := string(b)

		ss := strings.Split(s, "---")
		header := []byte(ss[1])

		var old oldh
		err = yaml.Unmarshal(header, &old)
		if err != nil {
			log.Fatalf("cannot parse configuration, err: %v\n", err)
		}

		dd, err := time.Parse("2006-01-02 15:04:05", old.Date)
		if err != nil {
			panic(err)
		}

		newHeader := newh{
			Date: old.Date,
			TOC:  true,
			ID:   old.ID,
			Slug: fmt.Sprintf("/posts/%s", strings.Replace(strings.ToLower(old.Title), " ", "-", -1)),
			Aliases: []string{
				fmt.Sprintf("/archives/%d/%02d/%d/", dd.Year(), dd.Month(), old.ID),
			},
			Tags:  old.Tags,
			Title: old.Title,
		}

		b, err = yaml.Marshal(newHeader)
		if err != nil {
			panic(err)
		}

		ss[1] = string(b)

		err = os.WriteFile(path, []byte(strings.Join(ss, "---\n")), os.ModePerm)
		if err != nil {
			panic(err)
		}
		return nil
	})
}
