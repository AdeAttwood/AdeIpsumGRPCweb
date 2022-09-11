fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure().compile(&["./proto/v1/adeipsum.proto"], &["./proto/"])?;

    Ok(())
}
