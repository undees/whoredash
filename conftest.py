import pytest
import subprocess
import time
import signal


@pytest.fixture(scope="session")
def _server():
    proc = subprocess.Popen(
        ["bun", "serve.js"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(1)
    yield proc
    proc.send_signal(signal.SIGTERM)
    proc.wait(timeout=5)


@pytest.fixture(scope="session")
def browser_context_args(_server):
    return {}


@pytest.fixture(scope="session")
def base_url(_server):
    return "http://localhost:3000"
