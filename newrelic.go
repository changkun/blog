// Copyright (c) 2020 Changkun Ou. All rights reserved.

package main

import (
	"log"
	"net/http"
	"os"

	"github.com/newrelic/go-agent/v3/newrelic"
)

var (
	app     *newrelic.Application
	wrapper = newrelic.WrapHandle
)

func init() {
	lice := os.Getenv("NEWRELIC_LICENSE")

	if lice == "" {
		// Don't use NewRelic is name or license is missing.
		wrapper = func(app *newrelic.Application, pattern string, handler http.Handler) (string, http.Handler) {
			return pattern, handler
		}
		log.Println("NewRelic is deactivated.")
		return
	}

	var err error
	app, err = newrelic.NewApplication(
		newrelic.ConfigAppName("blog.changkun.de"),
		newrelic.ConfigLicense(lice),
		newrelic.ConfigDistributedTracerEnabled(true),
	)
	if err != nil {
		log.Fatalf("Failed to created NewRelic application: %v", err)
	}

	log.Println("NewRelic is activated.")
}
