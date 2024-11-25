import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[

        #logging.StreamHandler(),   - Uncomment to print log to console
        logging.FileHandler("app.log", mode="a"),
    ]
)

logger = logging.getLogger("app_logger")
