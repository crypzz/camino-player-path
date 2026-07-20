# Import side-effects register detectors.
from . import touch_pass_shot  # noqa: F401
from . import defensive  # noqa: F401
from .registry import DETECTORS, run_all, register  # noqa: F401
